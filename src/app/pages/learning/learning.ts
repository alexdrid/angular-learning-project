import { Component } from '@angular/core';

interface Topic {
  title: string;
  description: string;
}

@Component({
  selector: 'app-learning',
  imports: [],
  templateUrl: './learning.html',
  styleUrl: './learning.scss',
})
export class Learning {
  topics: Topic[] = [
    {
      title: 'Components',
      description: 'Building blocks of an Angular app. Each component has a template, styles, and logic.',
    },
    {
      title: 'Signals',
      description: 'Angular\'s reactive primitives for managing state — signal(), computed(), and effect().',
    },
    {
      title: 'Routing',
      description: 'Navigate between pages with the Angular Router using lazy-loaded components and route guards.',
    },
    {
      title: 'Dependency Injection',
      description: 'Provide services and values throughout your app using Angular\'s built-in DI system.',
    },
    {
      title: 'Forms',
      description: 'Handle user input with template-driven, reactive, or the new signal-based forms.',
    },
    {
      title: 'HTTP Client',
      description: 'Communicate with backends using HttpClient, interceptors, and typed responses.',
    },
  ];
}
