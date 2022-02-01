# Medplum Vite Demo

This example app demonstrates the following:

- Creating a new React app with Vite
- Adding Medplum dependencies
- Adding basic URL routing
- Using the Medplum client to search for FHIR resources
- Using Medplum React controls to display FHIR data

## Getting started

This application was created using [Vite](https://vitejs.dev/). Vite is a great tool for building React apps quickly.

For more details about the basics of creating a Vite project, check out [Scaffolding Your First Vite Project](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

## index.html

The main entry point for our application is `index.html`. Here you can set basic HTML values such as the page title. Vite knows to use `index.html` to load additional JavaScript resources.

This line instructs Vite to start loading JavaScript from `src/main.jsx`:

```html
<script type="module" src="/src/main.jsx"></script>
```

## main.jsx

Our JavaScript entry point is `main.jsx`. This is pretty similar to the default content from Vite, with a few notable additions:

We import `MedplumClient`, which we will use as the API client to access Medplum services.

```js
import { MedplumClient } from "@medplum/core";
```

We import `MedplumProvider`, which is a React context provider. If you are not familiar with React context, don't worry, this is what allows us to use the `MedplumClient` throughout the application.

```js
import { MedplumProvider } from "@medplum/ui";
```

Next we import `BrowserRouter`, which enables URL routing. That means we will show different React components depending on the browser's URL location.

```js
import { BrowserRouter } from "react-router-dom";
```

Finally, we also import the Medplum CSS.

```js
import "@medplum/ui/styles.css";
```

Ok, that's all of our imports. Now we can connect them all together.

```js
const medplum = new MedplumClient();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <MedplumProvider medplum={medplum}>
        <App />
      </MedplumProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
```

## App.jsx

Our main React component is in `App.jsx`.

The first thing to notice here is the `useMedplumProfile()` React hook. React hooks are special functions that are connected to React rendering. If something inside the hook changes, the component will update. The `useMedplumProfile()` hook returns the current Medplum user profile. If the profile changes (for example, sign in or sign out), then the component will update.

```js
const profile = useMedplumProfile();
```

We can use `profile` to determine which pages are available. First we create a set of routes for users who are not signed in:

1. Landing page at "/"
2. Sign in page at "/signin"

```js
if (!profile) {
  // Not signed in
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
    </Routes>
  );
}
```

We also create routes for users who are signed in:

1. Default home page at "/"
2. Patient details page at "/Patient/:id"

```js
} else {
  // Signed in
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/Patient/:id" element={<PatientPage />} />
    </Routes>
  );
}
```

Note the special ":id" syntax. That means that the page can use the "id" parameter. We'll see that later in `PatientPage`.

## LandingPage.jsx

This is a static landing page for users who arrive at the site, and are not signed in yet.

On this page, we introduce another Medplum React component: `<Document>`. `<Document>` can be used to create a surface on the page for content. It creates a bordered section with white background and shadow.

## SignInPage.jsx

Here is our sign in page. While a sign in page might seem simple, there is a ton of hidden complexity. Luckily, we can use the Medplum React component `<SignInForm>` to make life easier.

All we have to do is provide a success callback:

```js
return <SignInForm onSuccess={() => navigate("/")} />;
```

That says: "When the user successfully authenticates, nagivate to the URL '/'".

## HomePage.jsx

When a user visits the site, and is signed in, they will see `HomePage.jsx` by default.

The `<HomePage>` component is pretty short -- only about 20 lines -- but there is a lot going on. Let's break it down line by line.

First, we use the `useMedplum()` React hook to get our Medplum client:

```js
const medplum = useMedplum();
```

Next, we use the `useMedplumProfile()` React hook to get the current user profile:

```js
const profile = useMedplumProfile();
```

On this page, we want to display a list of patients. We need a place to temporarily store those patients. In React, this is called "state". We can use the React hook `useState()` to create the state variable:

```js
const [patients, setPatients] = useState();
```

To actually **load** the patients, we need to request them from the Medplum API server. We want to do that once when we load this page. In React, that's called an "effect". We use the `useEffect()` hook to run JavaScript code once:

```js
useEffect(() => {
  medplum.search({ resourceType: "Patient" }).then(setPatients);
}, []);
```

While waiting for patients to load, we show a loading spinner:

```js
if (!patients) {
  return <Loading />;
}
```

And now, with our patients ready to go, we can build the main page:

```js
return (
  <Document>
    <h1>Welcome {profile.name[0].given[0]}</h1>
    <h3>Patients</h3>
    {patients.entry.map((e) => (
      <div key={e.resource.id}>
        <ResourceBadge link={true} value={e.resource} />
      </div>
    ))}
  </Document>
);
```

Note the `<ResourceBadge>` component. That is a Medplum React component that shows a simple representation of the resource. It is content aware, so it shows a smart representation depending on what the content is. For a FHIR Patient resource, it shows the patient avatar and the patient name. When the `link` attribute is `true`, the badge becomes a link to the resource page. By default, the link target is `resourceType/id`, which leads us to our final page...

## PatientPage.jsx

Our final page is the patient page, where will dump the patient data. This is where you can customize everything to your specific needs.

This page is composed of concepts that we have already seen before. Let's quickly review:

We use the `useMedplum()` hook to get the Medplum client:

```js
const medplum = useMedplum();
```

We use the `useParams()` hook from `react-router` to extract the patient ID from the URL:

```js
const { id } = useParams();
```

We create a React state variable for our patient using `useState()`:

```js
const [patient, setPatient] = useState();
```

We kick off a request for the patient when the page loads using `useEffect()`:

```js
useEffect(() => {
  medplum.read("Patient", id).then(setPatient);
}, [id]);
```

We display a loading spinner while we wait for the patient to load:

```js
if (!patient) {
  return <Loading />;
}
```

And finally, when we have the patient data, we can show the patient:

```js
return (
  <Document>
    <h1>
      <ResourceName value={patient} />
    </h1>
    <pre>{JSON.stringify(patient, null, 2)}</pre>
  </Document>
);
```
