using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager, 
        ITokenService tokenService, IMapper mapper)
        {
            _mapper = mapper;
            this._userManager = userManager;
            this._signInManager = signInManager;
            _tokenService = tokenService;
           
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDto registerDto)
        {
            if (await IsUserExists(registerDto.Username)) return BadRequest("UserName is already taken");

            var user = _mapper.Map<AppUser>(registerDto);

            //using var hmac = new HMACSHA512();


            user.UserName = registerDto.Username.ToLower();
            // user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
            // user.PasswordSalt = hmac.Key;


            var result = await _userManager.CreateAsync(user,registerDto.Password);

            if(!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await _userManager.AddToRoleAsync(user,"Member");

            if(!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return new UserDTO { Username = user.UserName, Token = await _tokenService.CreateToken(user) ,KnownAs =user.KnownAs ,Gender = user.Gender };
        }

        private async Task<bool> IsUserExists(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO login)
        {
            var user = await _userManager.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == login.UserName.ToLower());
            
            if (user == null) return Unauthorized("User Not Found");

            //using var hmac = new HMACSHA512(user.PasswordSalt);

            //var computedhash = hmac.ComputeHash(Encoding.UTF8.GetBytes(login.Password));

            // for (int i = 0; i < computedhash.Length; i++)
            // {
            //     if (computedhash[i] != user.PasswordHash[i]) return Unauthorized("Invalid Password or Username");
            // }
            var result =await _signInManager.CheckPasswordSignInAsync(user,login.Password,false);

            if(!result.Succeeded) return Unauthorized();

            return new UserDTO { Username = user.UserName, Token = await _tokenService.CreateToken(user), PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,KnownAs =user.KnownAs ,Gender = user.Gender}; ;
        }
    }
}