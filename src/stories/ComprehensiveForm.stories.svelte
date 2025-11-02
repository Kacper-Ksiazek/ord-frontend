<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";

  // biome-ignore lint/correctness/noUnusedVariables: Story
  const { Story } = defineMeta({
    title: "Flowbite/Comprehensive Form",
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  import {
    Card,
    Label,
    Input,
    Select,
    Textarea,
    Checkbox,
    Radio,
    Toggle,
    Button,
    Helper,
    Alert,
    Badge,
    Progressbar,
    Breadcrumb,
    BreadcrumbItem,
  } from "flowbite-svelte";
  import {
    UserSolid,
    EnvelopeSolid,
    PhoneSolid,
    GlobeSolid,
    BuildingSolid,
    CreditCardSolid,
    CheckCircleSolid,
    MoonSolid,
    SunSolid,
  } from "flowbite-svelte-icons";

  // Theme state
  let isDarkMode = $state(false);

  // Form state
  let formData = $state({
    // Personal Information
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-01-01",
    gender: "male",

    // Address Information
    street: "123 Main Street, Apt 4B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "US",

    // Professional Information
    company: "Acme Corporation",
    position: "Software Engineer",
    department: "Engineering",
    salary: "120000",
    experience: "5",

    // Account Settings
    username: "johndoe",
    password: "Password123!",
    confirmPassword: "Password123!",

    // Preferences
    newsletter: true,
    notifications: true,
    twoFactor: true,
    privacyPolicy: true,
    termsOfService: true,

    // Additional Information
    bio: "Passionate engineer, coffee lover, and open source enthusiast.",
    interests: ["Programming", "Hiking", "Photography"],
    skills: ["JavaScript", "TypeScript", "Svelte"],
    preferredContact: "email",

    // Payment Information
    cardNumber: "4111 1111 1111 1111",
    cardName: "John Doe",
    expiryDate: "2025-12",
    cvv: "123",
  });

  let formProgress = $state(0);
  let currentStep = $state(1);
  let showSuccess = $state(false);
  let formErrors = $state<Record<string, string>>({});

  const steps = [
    { number: 1, title: "Personal Info", fields: 6 },
    { number: 2, title: "Address", fields: 5 },
    { number: 3, title: "Professional", fields: 5 },
    { number: 4, title: "Account", fields: 3 },
    { number: 5, title: "Preferences", fields: 7 },
    { number: 6, title: "Payment", fields: 4 },
  ];

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    // Update both the html element and body to ensure dark mode works in Storybook
    const html = document.documentElement;
    const body = document.body;

    if (isDarkMode) {
      html.classList.add("dark");
      body.classList.add("dark");
    } else {
      html.classList.remove("dark");
      body.classList.remove("dark");
    }
  }

  // Initialize theme on mount
  $effect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  });

  function validateStep(step: number): boolean {
    formErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.firstName) {
        formErrors.firstName = "First name is required";
        isValid = false;
      }
      if (!formData.lastName) {
        formErrors.lastName = "Last name is required";
        isValid = false;
      }
      if (!formData.email || !formData.email.includes("@")) {
        formErrors.email = "Valid email is required";
        isValid = false;
      }
    }

    if (step === 4) {
      if (!formData.username || formData.username.length < 3) {
        formErrors.username = "Username must be at least 3 characters";
        isValid = false;
      }
      if (!formData.password || formData.password.length < 8) {
        formErrors.password = "Password must be at least 8 characters";
        isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        formErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    if (step === 5) {
      if (!formData.privacyPolicy) {
        formErrors.privacyPolicy = "You must accept the privacy policy";
        isValid = false;
      }
      if (!formData.termsOfService) {
        formErrors.termsOfService = "You must accept the terms of service";
        isValid = false;
      }
    }

    return isValid;
  }

  function nextStep() {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        currentStep++;
        updateProgress();
      }
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      updateProgress();
    }
  }

  function updateProgress() {
    formProgress = ((currentStep - 1) / (steps.length - 1)) * 100;
  }

  function submitForm() {
    if (validateStep(currentStep)) {
      showSuccess = true;
      console.log("Form submitted:", formData);
    }
  }

  function toggleInterest(interest: string) {
    if (formData.interests.includes(interest)) {
      formData.interests = formData.interests.filter((i) => i !== interest);
    } else {
      formData.interests = [...formData.interests, interest];
    }
  }

  function toggleSkill(skill: string) {
    if (formData.skills.includes(skill)) {
      formData.skills = formData.skills.filter((s) => s !== skill);
    } else {
      formData.skills = [...formData.skills, skill];
    }
  }

  $effect(() => {
    updateProgress();
  });
</script>

<Story name="Multi-Step Form with Theme Toggle">
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-200"
  >
    <!-- Theme Toggle Button -->
    <div class="max-w-6xl mx-auto mb-4 flex justify-end">
      <Button
        color={isDarkMode ? "yellow" : "dark"}
        onclick={toggleTheme}
        class="flex items-center gap-2"
      >
        {#if isDarkMode}
          <SunSolid class="w-4 h-4" />
          Light Mode
        {:else}
          <MoonSolid class="w-4 h-4" />
          Dark Mode
        {/if}
      </Button>
    </div>

    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Professional Registration Form
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Complete all steps to create your comprehensive profile
        </p>
      </div>

      <!-- Breadcrumb Navigation -->
      <Breadcrumb class="mb-6">
        {#each steps as step}
          <BreadcrumbItem
            home={step.number === 1}
            class={currentStep === step.number ? "font-bold" : ""}
          >
            {step.title}
          </BreadcrumbItem>
        {/each}
      </Breadcrumb>

      <!-- Progress Bar -->
      <Card class="mb-6 max-w-full px-8 py-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep} of {steps.length}
          </span>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(formProgress)}% Complete
          </span>
        </div>
        <Progressbar progress={formProgress.toString()} color="primary" />
      </Card>

      <!-- Success Message -->
      {#if showSuccess}
        <Alert color="green" class="mb-6">
          {#snippet icon()}
            <CheckCircleSolid class="w-5 h-5" />
          {/snippet}
          <span class="font-medium">Success!</span>
          Your registration has been completed successfully. Check the console for
          submitted data.
        </Alert>
      {/if}

      <!-- Form Steps -->
      <Card class="p-8 max-w-full">
        <form
          onsubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          class="space-y-6"
        >
          <!-- Step 1: Personal Information -->
          {#if currentStep === 1}
            <div class="space-y-6">
              <div
                class="flex items-center gap-3 pb-4 border-b dark:border-gray-700"
              >
                <div class="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <UserSolid
                    class="w-6 h-6 text-primary-600 dark:text-primary-400"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Personal Information
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400">
                    Tell us about yourself
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label for="firstName" class="mb-2">
                    First Name <span class="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    bind:value={formData.firstName}
                    placeholder="John"
                    type="text"
                    color={formErrors.firstName ? "red" : undefined}
                    class="ps-9"
                  >
                    {#snippet left()}
                      <UserSolid class="w-5 h-5 text-gray-500" />
                    {/snippet}
                  </Input>
                  {#if formErrors.firstName}
                    <Helper class="mt-2" color="red"
                      >{formErrors.firstName}</Helper
                    >
                  {/if}
                </div>

                <div>
                  <Label for="lastName" class="mb-2">
                    Last Name <span class="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    bind:value={formData.lastName}
                    placeholder="Doe"
                    color={formErrors.lastName ? "red" : undefined}
                  />
                  {#if formErrors.lastName}
                    <Helper class="mt-2" color="red"
                      >{formErrors.lastName}</Helper
                    >
                  {/if}
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label for="email" class="mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    bind:value={formData.email}
                    placeholder="john.doe@example.com"
                    color={formErrors.email ? "red" : undefined}
                    class="ps-9"
                  >
                    {#snippet left()}
                      <EnvelopeSolid class="w-5 h-5 text-gray-500" />
                    {/snippet}
                  </Input>
                  {#if formErrors.email}
                    <Helper class="mt-2" color="red">{formErrors.email}</Helper>
                  {/if}
                </div>

                <div>
                  <Label for="phone" class="mb-2">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    bind:value={formData.phone}
                    placeholder="+1 (555) 123-4567"
                    class="ps-9"
                  >
                    {#snippet left()}
                      <PhoneSolid class="w-5 h-5 text-gray-500" />
                    {/snippet}
                  </Input>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label for="dob" class="mb-2">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    bind:value={formData.dateOfBirth}
                  />
                </div>

                <div>
                  <Label class="mb-2">Gender</Label>
                  <div class="flex gap-4">
                    <Radio
                      name="gender"
                      bind:group={formData.gender}
                      value="male">Male</Radio
                    >
                    <Radio
                      name="gender"
                      bind:group={formData.gender}
                      value="female">Female</Radio
                    >
                    <Radio
                      name="gender"
                      bind:group={formData.gender}
                      value="other">Other</Radio
                    >
                  </div>
                </div>
              </div>
            </div>
          {/if}

          <!-- Step 2: Address Information -->
          {#if currentStep === 2}
            <div class="space-y-6">
              <div
                class="flex items-center gap-3 pb-4 border-b dark:border-gray-700"
              >
                <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <GlobeSolid
                    class="w-6 h-6 text-green-600 dark:text-green-400"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Address Information
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400">
                    Where are you located?
                  </p>
                </div>
              </div>

              <div>
                <Label for="street" class="mb-2">Street Address</Label>
                <Input
                  id="street"
                  bind:value={formData.street}
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label for="city" class="mb-2">City</Label>
                  <Input
                    id="city"
                    bind:value={formData.city}
                    placeholder="San Francisco"
                  />
                </div>

                <div>
                  <Label for="state" class="mb-2">State / Province</Label>
                  <Select id="state" bind:value={formData.state}>
                    <option value="">Select a state</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    <option value="WA">Washington</option>
                    <option value="IL">Illinois</option>
                  </Select>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label for="zipCode" class="mb-2">ZIP / Postal Code</Label>
                  <Input
                    id="zipCode"
                    bind:value={formData.zipCode}
                    placeholder="94102"
                  />
                </div>

                <div>
                  <Label for="country" class="mb-2">Country</Label>
                  <Select id="country" bind:value={formData.country}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                  </Select>
                </div>
              </div>
            </div>
          {/if}

          <!-- Step 3: Professional Information -->
          {#if currentStep === 3}
            <div class="space-y-6">
              <div
                class="flex items-center gap-3 pb-4 border-b dark:border-gray-700"
              >
                <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <BuildingSolid
                    class="w-6 h-6 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Professional Information
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400">
                    Your work details
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label for="company" class="mb-2">Company Name</Label>
                  <Input
                    id="company"
                    bind:value={formData.company}
                    placeholder="Acme Corp"
                  />
                </div>

                <div>
                  <Label for="position" class="mb-2">Job Position</Label>
                  <Input
                    id="position"
                    bind:value={formData.position}
                    placeholder="Senior Developer"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label for="department" class="mb-2">Department</Label>
                  <Select id="department" bind:value={formData.department}>
                    <option value="">Select department</option>
                    <option value="engineering">Engineering</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                  </Select>
                </div>

                <div>
                  <Label for="experience" class="mb-2"
                    >Years of Experience</Label
                  >
                  <Select id="experience" bind:value={formData.experience}>
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5-10">5-10 years</option>
                    <option value="10+">10+ years</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label for="salary" class="mb-2">Expected Salary Range</Label>
                <Select id="salary" bind:value={formData.salary}>
                  <option value="">Select salary range</option>
                  <option value="30-50k">$30,000 - $50,000</option>
                  <option value="50-75k">$50,000 - $75,000</option>
                  <option value="75-100k">$75,000 - $100,000</option>
                  <option value="100-150k">$100,000 - $150,000</option>
                  <option value="150k+">$150,000+</option>
                </Select>
              </div>
            </div>
          {/if}

          <!-- Step 4: Account Settings -->
          {#if currentStep === 4}
            <div class="space-y-6">
              <div
                class="flex items-center gap-3 pb-4 border-b dark:border-gray-700"
              >
                <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <UserSolid
                    class="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Account Settings
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400">
                    Create your login credentials
                  </p>
                </div>
              </div>

              <div>
                <Label for="username" class="mb-2">
                  Username <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  bind:value={formData.username}
                  placeholder="johndoe123"
                  color={formErrors.username ? "red" : undefined}
                />
                <Helper class="mt-2">Must be at least 3 characters long</Helper>
                {#if formErrors.username}
                  <Helper class="mt-2" color="red">{formErrors.username}</Helper
                  >
                {/if}
              </div>

              <div>
                <Label for="password" class="mb-2">
                  Password <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  bind:value={formData.password}
                  placeholder="••••••••"
                  color={formErrors.password ? "red" : undefined}
                />
                <Helper class="mt-2">Must be at least 8 characters long</Helper>
                {#if formErrors.password}
                  <Helper class="mt-2" color="red">{formErrors.password}</Helper
                  >
                {/if}
              </div>

              <div>
                <Label for="confirmPassword" class="mb-2">
                  Confirm Password <span class="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  bind:value={formData.confirmPassword}
                  placeholder="••••••••"
                  color={formErrors.confirmPassword ? "red" : undefined}
                />
                {#if formErrors.confirmPassword}
                  <Helper class="mt-2" color="red"
                    >{formErrors.confirmPassword}</Helper
                  >
                {/if}
              </div>
            </div>
          {/if}

          <!-- Step 5: Preferences -->
          {#if currentStep === 5}
            <div class="space-y-6">
              <div
                class="flex items-center gap-3 pb-4 border-b dark:border-gray-700"
              >
                <div class="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <CheckCircleSolid
                    class="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Preferences & Settings
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400">
                    Customize your experience
                  </p>
                </div>
              </div>

              <div class="space-y-4">
                <Toggle bind:checked={formData.newsletter}
                  >Subscribe to newsletter</Toggle
                >
                <Toggle bind:checked={formData.notifications}
                  >Enable email notifications</Toggle
                >
                <Toggle bind:checked={formData.twoFactor}
                  >Enable two-factor authentication</Toggle
                >
              </div>

              <div>
                <Label class="mb-3">Preferred Contact Method</Label>
                <div class="space-y-2">
                  <Radio
                    name="contact"
                    bind:group={formData.preferredContact}
                    value="email">Email</Radio
                  >
                  <Radio
                    name="contact"
                    bind:group={formData.preferredContact}
                    value="phone">Phone</Radio
                  >
                  <Radio
                    name="contact"
                    bind:group={formData.preferredContact}
                    value="sms">SMS</Radio
                  >
                  <Radio
                    name="contact"
                    bind:group={formData.preferredContact}
                    value="none">No contact</Radio
                  >
                </div>
              </div>

              <div>
                <Label class="mb-3">Interests (Select all that apply)</Label>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {#each ["Technology", "Design", "Business", "Science", "Arts", "Sports"] as interest}
                    <Checkbox
                      checked={formData.interests.includes(interest)}
                      onchange={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Checkbox>
                  {/each}
                </div>
              </div>

              <div>
                <Label class="mb-3">Skills</Label>
                <div class="flex flex-wrap gap-2 mb-3">
                  {#each formData.skills as skill}
                    <Badge
                      color="blue"
                      large
                      dismissable
                      onclose={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Badge>
                  {/each}
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {#each ["JavaScript", "TypeScript", "React", "Vue", "Svelte", "Node.js", "Python", "Java"] as skill}
                    <Button
                      size="sm"
                      outline={!formData.skills.includes(skill)}
                      color={formData.skills.includes(skill)
                        ? "blue"
                        : "alternative"}
                      onclick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </Button>
                  {/each}
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t dark:border-gray-700">
                <Checkbox
                  bind:checked={formData.privacyPolicy}
                  color={formErrors.privacyPolicy ? "red" : "blue"}
                >
                  I agree to the <button
                    type="button"
                    onclick={(e) => e.preventDefault()}
                    class="text-blue-600 hover:underline">Privacy Policy</button
                  >
                  <span class="text-red-500">*</span>
                </Checkbox>
                {#if formErrors.privacyPolicy}
                  <Helper color="red">{formErrors.privacyPolicy}</Helper>
                {/if}

                <Checkbox
                  bind:checked={formData.termsOfService}
                  color={formErrors.termsOfService ? "red" : "blue"}
                >
                  I agree to the <button
                    type="button"
                    onclick={(e) => e.preventDefault()}
                    class="text-blue-600 hover:underline"
                    >Terms of Service</button
                  >
                  <span class="text-red-500">*</span>
                </Checkbox>
                {#if formErrors.termsOfService}
                  <Helper color="red">{formErrors.termsOfService}</Helper>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Step 6: Payment Information -->
          {#if currentStep === 6}
            <div class="space-y-6">
              <div
                class="flex items-center gap-3 pb-4 border-b dark:border-gray-700"
              >
                <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                  <CreditCardSolid
                    class="w-6 h-6 text-red-600 dark:text-red-400"
                  />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                    Payment Information
                  </h2>
                  <p class="text-gray-600 dark:text-gray-400">
                    Secure payment details
                  </p>
                </div>
              </div>

              <div>
                <Label for="cardNumber" class="mb-2">Card Number</Label>
                <Input
                  id="cardNumber"
                  bind:value={formData.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  maxlength={19}
                >
                  {#snippet left()}
                    <CreditCardSolid class="w-5 h-5 text-gray-500" />
                  {/snippet}
                </Input>
              </div>

              <div>
                <Label for="cardName" class="mb-2">Cardholder Name</Label>
                <Input
                  id="cardName"
                  bind:value={formData.cardName}
                  placeholder="JOHN DOE"
                />
              </div>

              <div class="grid grid-cols-2 gap-6">
                <div>
                  <Label for="expiryDate" class="mb-2">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    bind:value={formData.expiryDate}
                    placeholder="MM/YY"
                    maxlength={5}
                  />
                </div>

                <div>
                  <Label for="cvv" class="mb-2">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    bind:value={formData.cvv}
                    placeholder="123"
                    maxlength={4}
                  />
                </div>
              </div>

              <Alert color="blue">
                {#snippet icon()}
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                {/snippet}
                <span class="font-medium">Secure Payment:</span> Your payment information
                is encrypted and secure. We never store your full card details.
              </Alert>
            </div>
          {/if}

          <!-- Navigation Buttons -->
          <div
            class="flex justify-between items-center pt-6 border-t dark:border-gray-700"
          >
            <div>
              {#if currentStep > 1}
                <Button type="button" color="alternative" onclick={prevStep}
                  >Previous</Button
                >
              {/if}
            </div>

            <div class="flex gap-3">
              {#if currentStep < steps.length}
                <Button type="button" color="primary" onclick={nextStep}
                  >Next Step</Button
                >
              {:else}
                <Button type="submit" color="green">
                  <CheckCircleSolid class="w-5 h-5 me-2" />
                  Submit Registration
                </Button>
              {/if}
            </div>
          </div>
        </form>
      </Card>

      <!-- Footer Info -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Need help? Contact us at <a
            href="mailto:support@example.com"
            class="text-blue-600 hover:underline">support@example.com</a
          >
        </p>
      </div>
    </div>
  </div>
</Story>
