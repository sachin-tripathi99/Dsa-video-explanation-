class Solution {
    public int[] countBits(int n) {
        int[] ans = new int[n + 1];
        for (int i = 0; i <= n; i++)
            for (int x = i; x != 0; x >>= 1) ans[i] += x & 1;   // count each number's bits
        return ans;
    }
}
