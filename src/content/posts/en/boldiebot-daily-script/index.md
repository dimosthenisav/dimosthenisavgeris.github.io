---
title: "BoldieBot Daily Script"
description: "A small Python script that pushes daily GA4 metrics into Slack for non-analytical teams — so company performance shows up without anyone opening an analytics tool."
date: 2024-09-10
tags: ["product"]
cover: "./01-boldiebot.png"
toc: "side"
---

> This project was implemented with the assistance of Claude AI (3.5 Sonnet), which helped with troubleshooting, code refinement, and documentation.

## Purpose

I needed to automate the delivery of key GA4 metrics to non-analytical teams (Tech, Product, Finance) via Slack. The goal was to provide a daily snapshot of company performance without requiring access to analytics tools.

## Hypothesis

By automating daily metric delivery to Slack, I believed I could increase cross-team awareness of performance data and potentially lead to more data-driven discussions.

## Technical Implementation

### 1. GA4 API Integration

I used the Google Analytics Data API v1beta to fetch GA4 data. The core of the data fetching logic was implemented in the `get_report` function:

```python
def get_report(client):
    property_id = 'YOUR_GA4_PROPERTY_ID'  # Masked for security
    yesterday = datetime.now() - timedelta(days=1)
    last_week = yesterday - timedelta(days=7)

    general_request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[{"name": "date"}],
        metrics=[
            {"name": "activeUsers"},
            {"name": "sessions"},
        ],
        date_ranges=[
            {"start_date": yesterday.strftime('%Y-%m-%d'), "end_date": yesterday.strftime('%Y-%m-%d')},
            {"start_date": last_week.strftime('%Y-%m-%d'), "end_date": last_week.strftime('%Y-%m-%d')}
        ],
    )

    event_request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[{"name": "eventName"}, {"name": "date"}],
        metrics=[{"name": "eventCount"}],
        date_ranges=[
            {"start_date": last_week.strftime('%Y-%m-%d'), "end_date": yesterday.strftime('%Y-%m-%d')}
        ],
    )

    return client.run_report(general_request), client.run_report(event_request), yesterday, last_week
```

This function fetches general metrics (Users, Sessions) and event-specific data (Offer Form Submissions) for **yesterday** and the **same day last week**.

### 2. Data Processing

The `process_data` function handles the API response:

```python
def process_data(general_response, event_response, yesterday, last_week):
    metrics = ['Users', 'Sessions', 'Offer Form Submitted']
    results = []

    for i, metric in enumerate(metrics[:2]):
        yesterday_value = int(general_response.rows[0].metric_values[i].value)
        last_week_value = int(general_response.rows[1].metric_values[i].value)
        results.append(calculate_change(metric, yesterday_value, last_week_value))

    yesterday_str = yesterday.strftime('%Y%m%d')
    last_week_str = last_week.strftime('%Y%m%d')

    for row in event_response.rows:
        if row.dimension_values[0].value == "Offer Form Submitted":
            date = row.dimension_values[1].value
            count = int(row.metric_values[0].value)
            if date == yesterday_str:
                yesterday_value = count
            elif date == last_week_str:
                last_week_value = count

    results.append(calculate_change('Offer Form Submitted', yesterday_value, last_week_value))
    return results
```

This function calculates the day-over-day change for each metric.

### 3. Slack Integration

I used the Slack SDK to post messages. The core posting logic:

```python
def post_to_slack(message):
    slack_token = "YOUR_SLACK_BOT_TOKEN"  # Masked for security
    client = WebClient(token=slack_token)

    try:
        response = client.chat_postMessage(
            channel="YOUR_SLACK_CHANNEL_ID",  # Masked for security
            text=message
        )
        print("Message posted to Slack successfully")
    except SlackApiError as e:
        print(f"Error posting message to Slack: {e}")
```

## Technical Challenges and Solutions

**1. GA4 Data Discrepancies**

*Problem:* Initial script reported zero Offer Form Submissions, contradicting GA4 interface data.

*Solution:* I implemented extensive logging in the data processing function, which revealed a date format mismatch. GA4 was returning dates in `YYYYMMDD` format, while I was comparing with `YYYY-MM-DD`.

```python
print(f"Looking for Offer Form Submitted events on {yesterday_str} and {last_week_str}")
for row in event_response.rows:
    event_name = row.dimension_values[0].value
    date = row.dimension_values[1].value
    count = int(row.metric_values[0].value)
    if event_name == "Offer Form Submitted":
        print(f"Offer Form Submitted event found on {date}: {count}")
```

**2. Error Handling**

*Problem:* Silent failures during API issues.

*Solution:* Implemented try-except blocks with detailed error logging:

```python
try:
    # API call or data processing logic
    ...
except Exception as e:
    print(f"An error occurred: {str(e)}")
    sys.exit(1)
```

**3. Date Handling**

*Problem:* Inconsistent date formatting across the script.

*Solution:* Standardized date handling using `strftime`:

```python
yesterday_str = yesterday.strftime('%Y%m%d')
last_week_str = last_week.strftime('%Y%m%d')
```

**4. Automation**

I used **cron** to schedule daily execution:

```bash
0 9 * * * /usr/local/bin/python3 /path/to/ga4_to_slack.py >> /path/to/ga4_to_slack.log 2>&1
```

This runs the script daily at 9:00 AM and logs output and errors.

## Setting Up Cron

I wanted my GA4-to-Slack script to run automatically every day at 9:00 AM, so I used cron — a scheduler for your Mac that can run programs at specific times. To set it up, I opened Terminal and typed `crontab -e` to edit the list of scheduled tasks, then added this line:

```bash
0 9 * * * /usr/local/bin/python3 /Users/Dimosthenis/Documents/GA4toSlack/ga4_to_slack.py >> /Users/Dimosthenis/Documents/GA4toSlack/ga4_to_slack.log 2>&1
```

This tells the computer to run my script at 9:00 AM every day and save any messages about how it went. To test it without waiting until the next day, I changed the time to a few minutes in the future — when it was 2:42 PM, I set it to run at 2:46 PM — waited, and checked whether the Slack channel got the message and the log showed the script ran. After confirming it worked, I set the time back to 9:00 AM.

Setting this up took some trial and error, but now our teams get fresh GA4 data in Slack every morning without anyone having to remember to run the script.

## Results and Next Steps

The script now runs daily at 09:00, providing consistent KPI updates to non-analytical teams. Early feedback indicates increased data awareness across departments.

Next steps:

1. Add weekly/monthly trend analysis.
2. Add more KPIs:
   - Marketing: cost per acquisition, conversion rates
   - Product: user retention metrics or app data (DAU, etc.)
3. Add visualization capabilities, potentially using matplotlib to generate and attach charts to Slack messages.

Keep iterating and stay curious!

![](./01-boldiebot.png)
