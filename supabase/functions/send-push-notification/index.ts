import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0';

interface Token {
  token: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req: Request) => {
  try {
    const { user_id, title, body, data } = await req.json();

    const { data: tokens, error: tokensError } = await supabase
      .from('push_tokens')
      .select('token')
      .eq('user_id', user_id);

    if (tokensError) {
      return new Response(JSON.stringify({ error: tokensError.message }), { status: 500 });
    }

    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ message: 'No tokens found' }), { status: 200 });
    }

    const messages = tokens.map(({ token }: Token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: data || {},
    }));

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messages),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500 });
  }
});