using Domain.Enums;
using Microsoft.AspNetCore.Authorization;

namespace ReactNet.Server.Services;

public class AuthorizationExtensions
{
    public class AuthorizePolicies : AuthorizeAttribute
    {
        public AuthorizePolicies(params Policy[] policies)
        {
            string policyJoin = string.Join(",", policies.Select(p => p.ToString()));
            this.Policy = policyJoin;
        }
    }
}
