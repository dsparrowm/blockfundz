import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { useRef } from 'react';

const LiveChat = () => {
    const tawkMessengerRef = useRef();
    const propertyId = '6794d8253a8427326074c1bd';
    const widgetId = '1iiemolai';

    return (
        <div>
            {/* Your component content */}
            <TawkMessengerReact
                propertyId={propertyId}
                widgetId={widgetId}
                tawkMessengerRef={tawkMessengerRef}
            />
        </div>
    );
}

export default LiveChat;