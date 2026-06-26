# 1. Record architecture decisions

Date: 2026-06-26

## Status

Accepted

## Context

We need to capture the architectural decisions on this project — their rationale and consequences — in a durable, reviewable form that travels with the code.

## Decision

We will use Architecture Decision Records (Michael Nygard's format): numbered markdown files under docs/decisions, one per decision, managed with adr-tools.

## Consequences

Each significant decision leaves a small, searchable record. The format is enforced by the adr-structure lint rule, so records stay uniform and concise.
