<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let user = null;
  let loading = true;
  let error = null;
  
  onMount(async () => {
    // Check for OAuth errors in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    const errorMessage = urlParams.get('message');
    
    if (oauthError) {
      error = `OAuth Error: ${errorMessage || 'Authentication failed'}`;
      // Clear the error parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    try {
      const response = await fetch('http://localhost:4000/auth/me', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        user = data.user;
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      error = 'Failed to fetch user information';
    } finally {
      loading = false;
    }
  });
  
  function loginWithGitHub() {
    // Clear any previous errors
    error = null;
    window.location.href = 'http://localhost:4000/auth/github';
  }
  
  async function logout() {
    try {
      await fetch('http://localhost:4000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      user = null;
    } catch (err) {
      console.error('Error logging out:', err);
      error = 'Failed to logout';
    }
  }
</script>

{#if loading}
  <div class="container">
    <p>Loading...</p>
  </div>
{:else if error}
  <div class="container">
    <h2>Error</h2>
    <p class="error">{error}</p>
    <button on:click={loginWithGitHub}>Try Again</button>
  </div>
{:else if user}
  <div class="container">
    <h2>Welcome, {user.username}!</h2>
    {#if user.avatar_url}
      <img src={user.avatar_url} alt="{user.username}'s avatar" width="50" height="50" />
    {/if}
    <button on:click={logout}>Logout</button>
  </div>
{:else}
  <div class="container">
    <h2>FlowSync AI</h2>
    <p>The Verifiable Coordination Layer for Modern Product Teams</p>
    <button on:click={loginWithGitHub}>Sign in with GitHub</button>
  </div>
{/if}

<style>
  .error {
    color: #d32f2f;
    background-color: #ffebee;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
  }
</style>