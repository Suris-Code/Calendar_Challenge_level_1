using Domain.Common.Models;
using Domain.Enums;
using Infrastructure.Identity;
using Infrastructure.Identity.Welcome.Commands;
using Infrastructure.Identity.Welcome.Contracts;
using Infrastructure.Identity.Welcome.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static ReactNet.Server.Services.AuthorizationExtensions;

namespace ReactNet.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthManagementController(ILogger<AuthManagementController> logger, ISender mediator) : BaseController(logger, mediator)
{
    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginRequest model)
    {
        var response = await _mediator.Send(new LoginCommand(model.Email, model.Password, model.RememberMe));

        return Ok(response);
    }

    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [HttpPost("login2fa")]
    public async Task<IActionResult> Login2fa([FromBody] UserLogin2FaRequest model)
    {
        var (response, user) = await _mediator.Send(new Login2FaCommand(model.Email, model.Password, model.RememberMe, model.Code));

        return response.LoginOk
            ? Ok(user)
            : BadRequest(response.Message);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [IgnoreAntiforgeryToken]
    [HttpGet("logout")]
    public async Task<IActionResult> Logout()
    {
        var response = await _mediator.Send(new LogoutCommand());
        return Ok(response);
    }

    [AllowAnonymous]
    [IgnoreAntiforgeryToken]
    [HttpGet("me")]
    public async Task<IActionResult> GetLoggedInUser()
    {
        var response = await _mediator.Send(new GetLoggedInUserQuery());
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new RegisterCommand(request), cancellationToken);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        var response = await _mediator.Send(new VerifyEmailCommand(request));
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var response = await _mediator.Send(new ForgotPasswordCommand(request));
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var response = await _mediator.Send(new ResetPasswordCommand(request));
        return Ok(response);
    }
}