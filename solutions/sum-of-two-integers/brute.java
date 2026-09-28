class Solution {
    public int getSum(int a, int b) {
        while (b > 0) { a = inc(a); b = dec(b); }           // move one unit at a time
        while (b < 0) { a = dec(a); b = inc(b); }
        return a;
    }

    private int inc(int x) {                                // x + 1 with bits: flip trailing ones and the next zero
        int m = 1;
        while ((x & m) != 0) { x ^= m; m <<= 1; }
        return x | m;
    }

    private int dec(int x) {                                // x − 1 with bits
        int m = 1;
        while ((x & m) == 0 && m != 0) { x |= m; m <<= 1; }
        return x ^ m;
    }
}
