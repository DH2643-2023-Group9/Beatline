import { error, redirect } from '@sveltejs/kit';

const CLIENT_ID = "fd1121824a964f25a3f1ede3f782e0cf";
const CLIENT_SECRET = "";

let scope = 'user-read-private user-read-email';


// /** @type {import('./$types').PageServerLoad} */
// export async function load({ locals }) {
//     return
//     if (!locals.user) {
//         throw redirect(307, 'https://accounts.spotify.com/authorize?' +
//             new URLSearchParams({
//               response_type: 'code',
//               client_id: CLIENT_ID,
//               scope: scope,
//               redirect_uri: 'http://localhost:5173',
//             })
//         );
//     }
// }