class Solution {
    public int findTheWinner(int n, int k) {
        int pos = 0;                          // winner of a circle of 1 (0-based)
        for (int i = 2; i <= n; i++) {
            pos = (pos + k) % i;              // shift the smaller circle's winner by k
        }
        return pos + 1;
    }
}
