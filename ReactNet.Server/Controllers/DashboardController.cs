using Application.Features.Dashboard.Queries;
using Application.Features.Dashboard.Contracts;
using Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static ReactNet.Server.Services.AuthorizationExtensions;

namespace ReactNet.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class DashboardController(ILogger<DashboardController> logger, ISender mediator)
    : BaseController(logger, mediator)
{
    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpGet("statistics")]
    public async Task<ActionResult<GetDashboardStatisticsResponse>> GetDashboardStatistics([FromQuery] GetDashboardStatisticsRequest request, CancellationToken cancellationToken)
    {
        var query = new GetDashboardStatisticsQuery(request);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpGet("weekly-events")]
    public async Task<ActionResult<int>> GetWeeklyEventsTotal([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] DateTime? weekStart, CancellationToken cancellationToken)
    {
        var query = new GetWeeklyEventsTotalQuery(startDate, endDate, weekStart);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpGet("day-with-most-events")]
    public async Task<ActionResult> GetDayWithMostEvents([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] DateTime? weekStart, CancellationToken cancellationToken)
    {
        var query = new GetDayWithMostEventsQuery(startDate, endDate, weekStart);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpGet("day-with-most-hours")]
    public async Task<ActionResult> GetDayWithMostHours([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] DateTime? weekStart, CancellationToken cancellationToken)
    {
        var query = new GetDayWithMostHoursQuery(startDate, endDate, weekStart);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }

    [AuthorizePolicies(Policy.LoggedIn)]
    [HttpGet("daily-occupancy")]
    public async Task<ActionResult> GetDailyOccupancyPercentages([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] DateTime? weekStart, CancellationToken cancellationToken)
    {
        var query = new GetDailyOccupancyPercentagesQuery(startDate, endDate, weekStart);
        var response = await _mediator.Send(query, cancellationToken);
        return Ok(response);
    }
} 