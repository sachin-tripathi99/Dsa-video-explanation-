class Solution {
    public int sumSubarrayMins(int[] arr) {
        long MOD = 1_000_000_007L, total = 0;
        for (int i = 0; i < arr.length; i++) {
            int m = Integer.MAX_VALUE;
            for (int j = i; j < arr.length; j++) {
                m = Math.min(m, arr[j]);
                total = (total + m) % MOD;
            }
        }
        return (int) total;
    }
}
