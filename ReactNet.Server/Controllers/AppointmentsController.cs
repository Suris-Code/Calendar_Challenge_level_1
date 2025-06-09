using Application.Features.Appointments.Commands;
using Application.Features.Appointments.Contracts;
using Application.Features.Appointments.Queries;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static ReactNet.Server.Services.AuthorizationExtensions;

namespace ReactNet.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class AppointmentsController(ILogger<AppointmentsController> logger, ISender mediator)
    : BaseController(logger, mediator)
{
    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpGet]
    public async Task<ActionResult<GetAppointmentsResponse>> GetAppointments([FromQuery] GetAppointmentsRequest request, CancellationToken cancellationToken)
    {
        var query = new GetAppointmentsQuery(request);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<GetAppointmentResponse>> GetAppointment(int id, CancellationToken cancellationToken)
    {
        var query = new GetAppointmentQuery(new GetAppointmentRequest { Id = id });
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpPost]
    public async Task<ActionResult<CreateAppointmentResponse>> CreateAppointment([FromBody] CreateAppointmentRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateAppointmentCommand(request);
        var response = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetAppointment), new { id = response.Id }, response);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpPut("{id:int}")]
    public async Task<ActionResult<UpdateAppointmentResponse>> UpdateAppointment(int id, [FromBody] UpdateAppointmentRequest request, CancellationToken cancellationToken)
    {
        request.Id = id;
        var command = new UpdateAppointmentCommand(request);
        var response = await _mediator.Send(command, cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<DeleteAppointmentResponse>> DeleteAppointment(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteAppointmentCommand(new DeleteAppointmentRequest { Id = id });
        var response = await _mediator.Send(command, cancellationToken);
        return Ok(response);
    }
} 