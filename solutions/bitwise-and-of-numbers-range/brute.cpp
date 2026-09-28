class Solution {
public:
    int rangeBitwiseAnd(int left, int right) {
        int result = left;
        for (long long x = (long long)left + 1; x <= right && result; x++) result &= (int)x;   // stop once zero
        return result;
    }
};
