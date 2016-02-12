import { h } from 'preact';

import TimeHelper from '../../modules/timehelper';

const Time = ({ time, hourFormat24 }) => {
    var hour = time.hour;

    if (!hourFormat24 && time.pm) {
        hour -= 12;
        hour = TimeHelper.pad(hour === 0 ? 12 : hour);
    }

    return (
        <h1 className='colours__time'>
            {hour} : {time.minute} : {time.second}

            { !hourFormat24 ?
                <span className='colours__time__postfix'>{time.pm ? 'PM' : 'AM'}</span> :
                null
            }
        </h1>
    );
};

export default Time;
