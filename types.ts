import React from 'react';

export enum SurveyStep {
  INTRO = 'INTRO',
  SWIPE_POLL = 'SWIPE_POLL',
  RATING_SLIDER = 'RATING_SLIDER',
  IMPROVEMENT_GRID = 'IMPROVEMENT_GRID',
  CHAT_BOT = 'CHAT_BOT',
  COMPLETION = 'COMPLETION'
}

export interface SwipeCardData {
  id: number;
  question: string;
  imageUrl: string;
  yesLabel?: string;
  noLabel?: string;
}

export interface GridItem {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isOption?: boolean;
}