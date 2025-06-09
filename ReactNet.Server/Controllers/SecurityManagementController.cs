using Domain.Enums;
using Infrastructure.Identity.Users.Commands;
using Infrastructure.Identity.Users.Contracts;
using Infrastructure.Identity.Users.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using static ReactNet.Server.Services.AuthorizationExtensions;

namespace ReactNet.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class SecurityManagementController(ILogger<SecurityManagementController> logger, ISender mediator) : BaseController(logger, mediator)
{
    [AuthorizePolicies(Policy.Admin)]
    [HttpGet("users")]
    public async Task<ActionResult<GetUsersResponse>> GetUsers([FromQuery] GetUsersRequest request)
    {
        var response = await _mediator.Send(new GetUsersQuery(request));
        return Ok(response);
    }

    [AuthorizePolicies(Policy.Admin)]
    [HttpGet("users/{id:guid}")]
    public async Task<ActionResult<GetUserByIdResponse>> GetUserById(Guid id)
    {
        var response = await _mediator.Send(new GetUserByIdQuery(id));
        return Ok(response);
    }

    [AuthorizePolicies(Policy.Admin)]
    [HttpPost("users")]
    public async Task<ActionResult<CreateUserResponse>> CreateUser([FromBody] CreateUserRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new CreateUserCommand(request), cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.Admin)]
    [HttpPut("users")]
    public async Task<ActionResult<UpdateUserResponse>> UpdateUser([FromBody] UpdateUserRequest request, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new UpdateUserCommand(request), cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.Admin)]
    [HttpDelete("users/{id:guid}")]
    public async Task<ActionResult<DeleteUserResponse>> DeleteUser(Guid id, CancellationToken cancellationToken)
    {
        var response = await _mediator.Send(new DeleteUserCommand(id), cancellationToken);
        return Ok(response);
    }
} 