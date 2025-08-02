#!/bin/bash

# 🇮🇹 SCRANARA GODADDY DNS CHECKER
# "Waiting for DNS propagation with Italian flair!"

echo "🇮🇹 SCRANARA GODADDY! CHECKING DNS PROPAGATION..."
echo "🔄 Waiting for saintsal-ai.com to point to Azure..."
echo ""

AZURE_IP="51.8.250.98"
DOMAIN="saintsal-ai.com"
CHECK_COUNT=0

while true; do
    CHECK_COUNT=$((CHECK_COUNT + 1))
    echo "🔍 Check #$CHECK_COUNT - $(date '+%H:%M:%S')"
    
    # Get current IP
    CURRENT_IP=$(nslookup $DOMAIN | grep "Address:" | tail -1 | awk '{print $2}')
    
    echo "📍 Current IP: $CURRENT_IP"
    echo "🎯 Target IP:  $AZURE_IP"
    
    if [ "$CURRENT_IP" = "$AZURE_IP" ]; then
        echo ""
        echo "🎉 MAMA MIA! DNS IS LIVE!"
        echo "🚀 $DOMAIN now points to Azure!"
        echo "💪 SUPERSAL IS READY TO DOMINATE!"
        echo ""
        echo "🇮🇹 GRAZIE! SCRANARA WORKED!"
        
        # Test the actual website
        echo "🌐 Testing website response..."
        curl -I https://$DOMAIN
        
        break
    else
        echo "⏳ Still propagating... (GoDaddy IP detected)"
        echo "🇮🇹 Aspettando... (Waiting in Italian style)"
        echo ""
        sleep 30  # Check every 30 seconds
    fi
done

echo "🎊 SUPERSAL EMPIRE IS LIVE AT https://$DOMAIN!"
