class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        for (int r = 0; r < 9; r++) {                       // rows
            set<char> s;
            for (int c = 0; c < 9; c++) if (board[r][c] != '.' && !s.insert(board[r][c]).second) return false;
        }
        for (int c = 0; c < 9; c++) {                       // columns
            set<char> s;
            for (int r = 0; r < 9; r++) if (board[r][c] != '.' && !s.insert(board[r][c]).second) return false;
        }
        for (int b = 0; b < 9; b++) {                       // boxes
            set<char> s;
            for (int k = 0; k < 9; k++) {
                char d = board[(b / 3) * 3 + k / 3][(b % 3) * 3 + k % 3];
                if (d != '.' && !s.insert(d).second) return false;
            }
        }
        return true;
    }
};
