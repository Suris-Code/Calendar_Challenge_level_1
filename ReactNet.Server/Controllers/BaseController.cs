using MediatR;
using Microsoft.AspNetCore.Mvc;
using ReactNet.Server.Services;

namespace ReactNet.Server.Controllers;

[ServiceFilter(typeof(LogActionAttribute))]
public class BaseController(ILogger<BaseController> logger, ISender mediator) : ControllerBase
{
    protected readonly ILogger<BaseController> _logger = logger;
    protected readonly ISender _mediator = mediator;
}