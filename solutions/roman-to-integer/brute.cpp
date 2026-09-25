class Solution {
public:
    int romanToInt(string s) {
        unordered_map<string, int> pairs = {{"IV", 4}, {"IX", 9}, {"XL", 40}, {"XC", 90}, {"CD", 400}, {"CM", 900}};
        unordered_map<char, int> single = {{'I', 1}, {'V', 5}, {'X', 10}, {'L', 50}, {'C', 100}, {'D', 500}, {'M', 1000}};
        int total = 0;
        size_t i = 0;
        while (i < s.size()) {
            if (i + 1 < s.size() && pairs.count(s.substr(i, 2))) {
                total += pairs[s.substr(i, 2)];
                i += 2;
            } else {
                total += single[s[i]];
                i += 1;
            }
        }
        return total;
    }
};
