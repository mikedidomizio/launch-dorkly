# LaunchDorkly

For the LaunchDarkly expert

## Description

The purpose of this project is to give easier control of LaunchDarkly project configurations.

## ⚠️ Before using

This project is takes zero responsibility of any adverse changes to your LaunchDarkly setup.
This project isn't intended to manage everything LaunchDarkly but just a UI on top of the API calls.
<br/>
<br/>
Use this project at your own risk.

## Quick start

- This project requires a LaunchDarkly Personal Access Token which can be created [here](https://app.launchdarkly.com/settings/authorization)
- Set as environment variable `LAUNCH_DARKLY_PERSONAL_ACCESS_TOKEN` or create an `.env` with the env var name and value
- Launch the application

ℹ️ The Token can have either Reader/Writer access, the application should work fine with Reader although some actions may return errors (expected)


