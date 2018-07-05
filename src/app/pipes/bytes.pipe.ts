import { Pipe, PipeTransform } from '@angular/core';

export type ByteUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';


@Pipe({
    name: 'bytes'
})
export class BytesPipe implements PipeTransform {

    private units = [
        'bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
    ];

    transform(bytes: number = 0, precision: number = 3 ) : string {

        if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) return '?';

        let unit = 0;

        while ( bytes >= 1024 ) {
            bytes /= 1024;
            unit ++;
        }

        return bytes.toFixed( + precision ) + ' ' + this.units[ unit ];
        
    }

}