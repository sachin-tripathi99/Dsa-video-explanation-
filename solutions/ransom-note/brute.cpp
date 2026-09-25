class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        for (char c : ransomNote) {
            size_t idx = magazine.find(c);           // scan the magazine
            if (idx == string::npos) return false;
            magazine.erase(idx, 1);                  // use it up
        }
        return true;
    }
};
