class Solution {
    int inc(int x) {                                        // x + 1 with bits
        unsigned u = x, m = 1;
        while (u & m) { u ^= m; m <<= 1; }
        return (int)(u | m);
    }
    int dec(int x) {                                        // x − 1 with bits
        unsigned u = x, m = 1;
        while (!(u & m) && m) { u |= m; m <<= 1; }
        return (int)(u ^ m);
    }
public:
    int getSum(int a, int b) {
        while (b > 0) { a = inc(a); b = dec(b); }           // move one unit at a time
        while (b < 0) { a = dec(a); b = inc(b); }
        return a;
    }
};
