import { connect } from '@tidbcloud/serverless';


export interface Env {
   DATABASE_URL: string;
}

export default {
   async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
      const conn = connect({url:env.DATABASE_URL})
      
	  const url = new URL(request.url);
      const value1 = url.searchParams.get("value1");
	  const value_clear = value1?.replace(/"/g, ""); // すべての " を削除

	  console.log(value_clear);

	  const resp = await conn.execute("INSERT INTO `bookshop`.`users` (`id`, `nickname`, `balance`) VALUES (1, '"+value_clear+"', 100.00);")

      return new Response(JSON.stringify(resp));
   },
};