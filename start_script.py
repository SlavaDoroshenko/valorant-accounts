import sys
import json
from FunPayAPI import Account

TOKEN = '4gtzm7eore82uj5mt3a46pvfxcem805f'

def send_message(account_id, message):
    acc = Account(TOKEN).get()
    acc.send_message(account_id, message)

if __name__ == "__main__":
    accounts = json.loads(sys.argv[1])
    send_message("132280609", f"Привет, твоё кол-во аккаунтов: {len(accounts)}")
    print("Message sent")