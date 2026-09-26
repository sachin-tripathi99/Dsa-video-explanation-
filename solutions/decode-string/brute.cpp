class Solution {
public:
    string decodeString(string s) {
        while (s.find('[') != string::npos) {
            size_t close = s.find(']');                     // first ']' closes an innermost pair
            size_t open = s.rfind('[', close);
            size_t start = open;
            while (start > 0 && isdigit((unsigned char)s[start - 1])) start--;
            int k = stoi(s.substr(start, open - start));
            string inner = s.substr(open + 1, close - open - 1), rep;
            for (int i = 0; i < k; i++) rep += inner;
            s = s.substr(0, start) + rep + s.substr(close + 1);
        }
        return s;
    }
};
