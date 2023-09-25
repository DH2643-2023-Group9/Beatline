<script lang="ts">
    import { goto } from '$app/navigation';
    import { accessToken, type Tokens } from '$stores/tokenStore';
    export let data: Tokens;
    accessToken.setTokens(data);
    goto('/')
</script>