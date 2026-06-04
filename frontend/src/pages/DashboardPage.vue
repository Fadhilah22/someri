<template>
  <section class="hero">
    <h1>Learn Faster with Someri</h1>

    <p>
      AI-powered learning platform to help students understand,
      summarize, and master knowledge efficiently.
    </p>

    <button class="cta-btn">
      Get Started
    </button>
  </section>

  <section class="features">
    <div class="card">
      <h3>AI Summaries</h3>
      <p>Turn complex materials into concise explanations.</p>
    </div>

    <div class="card">
      <h3>Smart Learning</h3>
      <p>Personalized study flow powered by AI.</p>
    </div>

    <div class="card">
      <h3>Track Progress</h3>
      <p>Monitor learning consistency and achievements.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hero {
  background: var(--color-surface);
  padding: 48px;
  border-radius: 20px;
  margin-bottom: 32px;
  box-shadow: var(--shadow);
}

.hero h1 {
  margin-top: 0;
  font-size: 42px;
  color: var(--color-text);
}

.hero p {
  color: var(--color-text-muted);
  max-width: 600px;
  line-height: 1.6;
}

.cta-btn {
  margin-top: 24px;
  padding: 14px 24px;
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s;
}

.cta-btn:hover {
  background: var(--color-primary-hover);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.card {
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--color-primary) 50%, transparent) 0%,
      var(--color-surface) 45%
    );

  padding: 24px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 1px solid var(--color-border);

  transition:
    transform 0.2s,
    border-color 0.2s;
}

.card:hover {
  transform: translateY(-2px);

  border-color: color-mix(
    in srgb,
    var(--color-primary) 35%,
    var(--color-border)
  );
}

.card h3 {
  margin-top: 0;
  color: var(--color-text);
}

.card p {
  color: var(--color-text-muted);
}
</style>