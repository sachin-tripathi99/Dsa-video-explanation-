class Solution {
    public String longestPrefix(String s) {
        final long MOD = 1_000_000_007L, B = 131;
        int n = s.length(), best = 0;
        long pre = 0, suf = 0, pw = 1;
        for (int k = 1; k < n; k++) {
            pre = (pre * B + s.charAt(k - 1)) % MOD;         // append on the right
            suf = (s.charAt(n - k) * pw + suf) % MOD;       // prepend on the left
            pw = pw * B % MOD;
            if (pre == suf) best = k;
        }
        return s.substring(0, best);
    }
}
