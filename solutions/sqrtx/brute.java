class Solution {
    public int mySqrt(int x) {
        long k = 0;
        while ((k + 1) * (k + 1) <= x) k++;
        return (int) k;
    }
}
