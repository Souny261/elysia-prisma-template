export const middleware = {
    GenerateToken: async (ctx: any, id: number) => {
        const access_token = await ctx.jwt.sign({ id: id });
        const refresh_token = await ctx.refreshJwt.sign({ id: id });
        return {
            data: {
                access_token: access_token,
                refresh_token: refresh_token,
            },
        };
    },
    IsAuth: async (ctx: any) => {
        if (!ctx.bearer) {
            ctx.set.status = 401
            ctx.set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error='invalid_request'`

            return {
                status: false,
                message: 'Unauthorized'
            }
        }
        
        console.log(ctx.bearer);
        const profile = await ctx.jwt.verify(ctx.bearer);
        console.log(profile);

        if (!profile) {
            ctx.set.status = 401
            ctx.set.headers[
                'WWW-Authenticate'
            ] = `Bearer realm='sign', error='invalid_request'`
            console.log("ddddd");
            return {
                status: false,
                message: 'EXXXXXXXX'
            }
        }
    },

    GetFormIdFromToken: async (ctx: any): Promise<{ form_id: number, recipient_id: number }> => {
        if (!ctx.bearer) {
            ctx.set.status = 401
            throw new Error('Unauthorized')
        }
        const profile = await ctx.jwt.verify(ctx.bearer);
        if (!profile) {
            ctx.set.status = 401
            throw new Error('Unauthorized')
        }
        return profile
    },

    GetUserFromToken: async (ctx: any): Promise<number> => {
        if (!ctx.bearer) {
            ctx.set.status = 401
            throw new Error('Unauthorized')
        }
        const profile = await ctx.jwt.verify(ctx.bearer);
        if (!profile) {
            ctx.set.status = 401
            throw new Error('Unauthorized')
        }
        return profile.id
    }
}