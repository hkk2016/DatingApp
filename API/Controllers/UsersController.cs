using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhtotoService _phtotoService;

        public UsersController(IUserRepository userRepository, IMapper mapper, IPhtotoService phtotoService)
        {
            _phtotoService = phtotoService;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpGet]
        //[AllowAnonymous]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
        {
            // var users=await _userRepository.GetUsersAsync();
            // var usersToReturn = _mapper.Map<IEnumerable<MemberDTO>>(users);

            // return Ok(usersToReturn);

            return Ok(await _userRepository.GetMembersAsync());

        }

        [HttpGet("{username}",Name ="GetUser")]
        public async Task<ActionResult<MemberDTO>> GetUser(string username)
        {
            // var user= await _userRepository.GetUserByUsernameAsync(username);
            // var userToReturn = _mapper.Map<MemberDTO>(user);
            // return userToReturn

            return await _userRepository.GetMemberAsync(username);


        }

        //[Authorize]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<MemberDTO>> GetUser(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            var userToReturn = _mapper.Map<MemberDTO>(user);
            return userToReturn;

        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            _mapper.Map(memberUpdateDTO, user);
            _userRepository.Update(user);

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");

        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var result = await _phtotoService.AddPhotoAsync(file);

            if(result.Error!=null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId

            };

            if(user.Photos.Count==0)
            {
                photo.IsMain = true;
            }

            user.Photos.Add(photo);

            if(await _userRepository.SaveAllAsync())
            {
                
                return CreatedAtRoute("GetUser",new {username = user.UserName},_mapper.Map<PhotoDTO>(photo));
            }

            return BadRequest("Problem Addding Photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user =  await _userRepository.GetUserByUsernameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x=> x.Id ==photoId);
            if(photo.IsMain) return BadRequest("This is already ypur main photo");

            var currentMain = user.Photos.FirstOrDefault(x=>x.IsMain);

            if(currentMain!=null)
            {
                currentMain.IsMain = false;
            }

            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
             var user =  await _userRepository.GetUserByUsernameAsync(User.GetUserName());

             var photo = user.Photos.FirstOrDefault(x=> x.Id ==photoId);

             if(photo ==null) return NotFound();

             if(photo.IsMain) return BadRequest("You cannot delete main photo");

             if(photo.PublicId !=null)
             {
                 var result = await _phtotoService.DeletePhotoAsync(photo.PublicId);
                 if(result.Error != null)
                 {
                     return BadRequest(result.Error.Message);
                 }

                 user.Photos.Remove(photo);

                 if(await _userRepository.SaveAllAsync()) return Ok();

                

             }

              return BadRequest("Failed to Delete the Photo");

        }
    }
}