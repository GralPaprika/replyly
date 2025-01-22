import random
from datetime import datetime, timedelta
import json
import os

def generate_daily_data(start_date, channels, num_days=29):
    daily_data = {channel: [] for channel in channels}
    for day in range(num_days):
        date = start_date + timedelta(days=day)
        formatted_date = date.strftime('%Y-%m-%d')
        for channel in channels:
            messages_sent = random.randint(233, 1200)  # Simulación de interacciones para cada canal
            daily_data[channel].append({'date': formatted_date, 'messagesSent': messages_sent})
    return daily_data

def generate_weekly_data(daily_data):
    weekly_data = {channel: [] for channel in daily_data.keys()}
    start_date = datetime(2024, 2, 1)

    for channel in daily_data.keys():
        for week_start in range(0, 29, 7):
            week_date = start_date + timedelta(days=week_start)
            week_messages = sum(
                item['messagesSent']
                for item in daily_data[channel]
                if week_date <= datetime.strptime(item['date'], '%Y-%m-%d') < week_date + timedelta(days=7)
            )
            weekly_data[channel].append({
                'date': week_date.strftime('%Y-%m-%d'),
                'messagesSent': week_messages
            })
    return weekly_data

def generate_monthly_data(channels):
    monthly_data = {channel: [] for channel in channels}
    start_date = datetime(2024, 2, 1)

    for channel in channels:
        for month_offset in range(12):
            month_date = (start_date - timedelta(days=28)).replace(day=1) - timedelta(days=month_offset * 30)
            month_messages = random.randint(12000, 40000)  # Simulación de mensajes mensuales para cada canal
            monthly_data[channel].append({
                'date': month_date.strftime('%Y-%m'),
                'messagesSent': month_messages
            })
    return monthly_data

def generate_data_structure(user_id, channels, daily_data, weekly_data, monthly_data):
    return {
        "userId": user_id,
        "channels": {
            channel: {
                "totalMessagesSent": sum(item['messagesSent'] for item in daily_data[channel]),
                "dailyData": daily_data[channel],
                "weeklyData": weekly_data[channel],
                "monthlyData": monthly_data[channel]
            } for channel in channels
        }
    }

def main():
    channel_sets = [
        ['whatsapp'],
        ['whatsapp', 'facebook'],
        ['whatsapp', 'facebook', 'instagram'],
        ['whatsapp', 'facebook', 'instagram', 'shopify'],
        ['whatsapp', 'facebook', 'instagram', 'shopify', 'woocommerce']
    ]

    user_id = "12345"
    output_directory = 'components/charts'
    os.makedirs(output_directory, exist_ok=True)

    for i, channels in enumerate(channel_sets, start=1):
        start_date = datetime(2024, 2, 1)

        daily_data = generate_daily_data(start_date, channels)
        weekly_data = generate_weekly_data(daily_data)
        monthly_data = generate_monthly_data(channels)
        data_structure = generate_data_structure(user_id, channels, daily_data, weekly_data, monthly_data)

        json_data = json.dumps(data_structure, indent=4)
        output_file_path = os.path.join(output_directory, f'data{i}.json')

        with open(output_file_path, 'w') as json_file:
            json_file.write(json_data)

        print(f"JSON guardado en: {output_file_path}")

if __name__ == "__main__":
    main()
