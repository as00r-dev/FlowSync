<script>
  import { onMount } from 'svelte';
  
  let user = null;
  let loading = true;
  
  onMount(async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        user = data.user;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      loading = false;
    }
  });
  
  function loginWithGitHub() {
    window.location.href = 'http://localhost:4000/auth/github';
  }
  
  async function logout() {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      user = null;
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
</script>

{#if loading}
  <p>Loading...</p>
{:else if user}
  <div>
    <h2>Welcome, {user.username}!</h2>
    <img src={user.avatar_url} alt="{user.username}'s avatar" width="50" height="50" />
    <button on:click={logout}>Logout</button>
  </div>
{:else}
  <div>
    <h2>FlowSync AI</h2>
    <p>The Verifiable Coordination Layer for Modern Product Teams</p>
    <button on:click={loginWithGitHub}>Sign in with GitHub</button>
  </div>
{/if}