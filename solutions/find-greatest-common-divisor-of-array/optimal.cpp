class Solution {
public:
    int findGCD(vector<int>& nums) {
        int a = *max_element(nums.begin(), nums.end());
        int b = *min_element(nums.begin(), nums.end());
        while (b != 0) {           // Euclid: gcd(a, b) = gcd(b, a % b)
            int t = a % b;
            a = b;
            b = t;
        }
        return a;
    }
};
