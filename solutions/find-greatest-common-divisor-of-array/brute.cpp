class Solution {
public:
    int findGCD(vector<int>& nums) {
        int mn = *min_element(nums.begin(), nums.end());
        int mx = *max_element(nums.begin(), nums.end());
        for (int d = mn; d >= 1; d--) {
            if (mn % d == 0 && mx % d == 0) return d;
        }
        return 1;
    }
};
