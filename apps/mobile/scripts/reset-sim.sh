#!/bin/bash

echo "🔌 Shutting down all simulators..."
xcrun simctl shutdown all

echo "🧽 Erasing all simulator content and settings..."
xcrun simctl erase all

echo "📱 Relaunching Simulator app..."
open -a Simulator

echo "✅ Simulator reset complete."
