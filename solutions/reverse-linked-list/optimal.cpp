class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode *prev = nullptr, *cur = head;
        while (cur) {
            ListNode* next = cur->next; // remember the rest
            cur->next = prev;           // flip
            prev = cur;
            cur = next;
        }
        return prev;
    }
};
