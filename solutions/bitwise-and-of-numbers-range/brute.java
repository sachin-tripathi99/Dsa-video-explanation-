class Solution {
    public int rangeBitwiseAnd(int left, int right) {
        int result = left;
        for (long x = (long) left + 1; x <= right && result != 0; x++) result &= (int) x;   // stop once zero
        return result;
    }
}
