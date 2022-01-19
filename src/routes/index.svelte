<script lang="ts">
	import {messages, write} from '$lib/chat/messages';
	let message: string;
  
	function writeMessage() {
	  write(message);
	}
  </script>
  
  {#each $messages as message}
	{message.author}
  {/each}
  
  <input type="text" bind:value={message} />
  
  <button on:click={writeMessage}>write</button>
  