# BORA: A Personalized Data Display for Large-scale Experiments

<p align="left">
  <img src="./assets/katrin.png" width="100%" />
</p>

BORA is an open source visualization framework supporting large-scale experiments by generating personalized data displays and enabling the human-in-the-loop concept within the experiment. Despite the complex experiment setup, BORA allows scientists to build their desired data displays with no programming knowledge. There are two facets to the framework, with the first facet being a read-only data displays where it helps scientists to monitor the health of the experiment subsystems. The second facet enables scientists to control the systems and data acquisition parameters. It enables feedback for multiple data processing pipelines that interact with the large volume of data in real-time. Bora is built around RESTful APIs and offers support for various standard protocols through plugin extensions for databases (e.g., Redis) and for control protocols (e.g., OPC). Furthermore, we implemented experiment-specific protocols used in our projects, such as ORCA. 



## Bora 3 
Bora 3 builds upon the proven logic and concepts of Bora 2, retaining its core approach to personalized data displays. The project continues to use the familiar dashboard composition model, allowing users to create and manage displays from reusable widgets. A major new feature in Bora 3 is support for multiple independent schematics, enabling users to define and switch between different experiments, displays, and monitors within the same framework. This extensibility, combined with a modern web stack and typed widget model, makes authoring and managing dashboards even more flexible while preserving the strengths of the original system.

## Goals

- Deliver an intuitive user experience with simplified configuration and extensibility
- Enable management of multiple independent dashboards through flexible schematics
- Leverage a modern, strongly-typed web stack for reliability and maintainability
- Provide clear architectural explanations and comprehensive documentation


### Architecture

- Next.js App Router (React + TypeScript) for UI and server actions
- Prisma ORM with SQLite by default (configurable via `DATABASE_URL`)
- File-based dashboard schematics stored under `public/uploads`
- Strongly-typed widget model and dynamic rendering via a widget map
- Tailwind CSS + shadcn/ui for accessible, consistent components
