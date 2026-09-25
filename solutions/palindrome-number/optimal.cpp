class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int rev = 0;
        while (x > rev) {                 // reverse only half the digits
            rev = rev * 10 + x % 10;
            x /= 10;
        }
        return x == rev || x == rev / 10; // rev / 10 drops the middle digit (odd length)
    }
};
