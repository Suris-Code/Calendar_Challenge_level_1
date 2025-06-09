using Domain.Enums;

namespace ReactNet.Server.Services
{
    public static class ClaimPolicies
    {
        public static void AddClaimPolicies(IServiceCollection services)
        {
            services.AddAuthorization(opts =>
            {
                opts.AddPolicy(Policy.LoggedIn.ToString(), p =>
                {
                    p.RequireClaim(nameof(PolicyClaim.LoggedIn), "true");
                });

                opts.AddPolicy(Policy.Admin.ToString(), p =>
                {
                    p.RequireClaim(nameof(PolicyClaim.Admin), "true");
                });
            });
        }
    }
}
