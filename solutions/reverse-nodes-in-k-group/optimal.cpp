class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode dummy(0, head);
        ListNode* groupPrev = &dummy;
        while (true) {
            ListNode* kth = groupPrev;
            for (int i = 0; i < k && kth; i++) kth = kth->next;
            if (!kth) break;                                    // fewer than k left
            ListNode *after = kth->next, *first = groupPrev->next;
            ListNode *prev = after, *cur = first;
            while (cur != after) {                              // reverse the group
                ListNode* next = cur->next;
                cur->next = prev;
                prev = cur;
                cur = next;
            }
            groupPrev->next = kth;                              // kth is the new front
            groupPrev = first;                                  // old front is now the back
        }
        return dummy.next;
    }
};
