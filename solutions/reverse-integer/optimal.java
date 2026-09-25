class Solution {
    public int reverse(int x) {
        int rev = 0;
        while (x != 0) {
            int d = x % 10;                  // keeps the sign of x
            x /= 10;
            if (rev > Integer.MAX_VALUE / 10 || rev < Integer.MIN_VALUE / 10) return 0;  // would overflow
            rev = rev * 10 + d;
        }
        return rev;
    }
}
