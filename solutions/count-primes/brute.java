class Solution {
    public int countPrimes(int n) {
        int count = 0;
        for (int x = 2; x < n; x++) {
            boolean prime = true;
            for (int d = 2; (long) d * d <= x; d++) {
                if (x % d == 0) { prime = false; break; }
            }
            if (prime) count++;
        }
        return count;
    }
}
